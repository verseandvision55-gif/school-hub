
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'school_admin', 'teacher');

-- Schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- User roles table (separate from profiles per security guidelines)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  grade_level TEXT,
  section TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  roll_number TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Teacher-class assignments
CREATE TABLE public.teacher_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject TEXT,
  UNIQUE (teacher_id, class_id)
);

ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Grades table
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL DEFAULT 100,
  exam_name TEXT,
  graded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user's school_id
CREATE OR REPLACE FUNCTION public.get_user_school_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies

-- Schools: super_admin can do everything, others can read their own school
CREATE POLICY "Super admins manage schools" ON public.schools FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users can view their school" ON public.schools FOR SELECT USING (id = public.get_user_school_id(auth.uid()));

-- User roles: super_admin can manage, users can read own
CREATE POLICY "Super admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "School admins manage roles in their school" ON public.user_roles FOR ALL USING (
  public.has_role(auth.uid(), 'school_admin') AND
  public.get_user_school_id(auth.uid()) = public.get_user_school_id(user_id)
);
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

-- Profiles: users read own, admins read school profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Super admins manage all profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "School admins read school profiles" ON public.profiles FOR SELECT USING (
  public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid())
);

-- Classes: school-scoped
CREATE POLICY "School members can view classes" ON public.classes FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins manage classes" ON public.classes FOR ALL USING (
  public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid())
);

-- Students: school-scoped
CREATE POLICY "School members can view students" ON public.students FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins manage students" ON public.students FOR ALL USING (
  public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid())
);

-- Teacher classes
CREATE POLICY "Teachers can view own assignments" ON public.teacher_classes FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "School admins manage teacher assignments" ON public.teacher_classes FOR ALL USING (
  public.has_role(auth.uid(), 'school_admin')
);

-- Attendance
CREATE POLICY "Teachers can manage attendance" ON public.attendance FOR ALL USING (marked_by = auth.uid());
CREATE POLICY "School admins can view attendance" ON public.attendance FOR SELECT USING (
  public.has_role(auth.uid(), 'school_admin')
);

-- Grades
CREATE POLICY "Teachers can manage grades" ON public.grades FOR ALL USING (graded_by = auth.uid());
CREATE POLICY "School admins can view grades" ON public.grades FOR SELECT USING (
  public.has_role(auth.uid(), 'school_admin')
);
