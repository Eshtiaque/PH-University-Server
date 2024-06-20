import { Router } from "express";
import { StudentRoutes } from "../app/modules/student/student.route";
import { UserRoutes } from "../app/modules/user/user.route";
import { AcademicSemesterRoutes } from "../app/modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../app/modules/academicFaculty/AcademicFaculty.route";
import { AcademicDepartmentRoutes } from "../app/modules/academicDepartment/academicDepartment.router";
import { FacultyRoutes } from "../app/modules/Faculty/faculty.route";
import { AdminRoutes } from "../app/modules/Admin/admin.route";
import { CourseRoute } from "../app/modules/Course/Course.route";
import { semesterRegistrationRoutes } from "../app/modules/semesterRegistration/semesterRegistration.route";
import { offeredCourseRoutes } from "../app/modules/offeredCourse/OfferedCourse.route";
import { AuthRoutes } from "../app/modules/Auth/auth.route";



const router = Router()


const moduleRoutes = [
    {
        path: '/students',
        route: StudentRoutes
    },
    {
        path: '/users',
        route: UserRoutes
    },
    {
        path: '/academic-semester',
        route: AcademicSemesterRoutes
    },
    {
        path: '/academic-faculty',
        route: AcademicFacultyRoutes
    },
    {
        path: '/academic-department',
        route: AcademicDepartmentRoutes
    },
    {
        path: '/faculty',
        route: FacultyRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path:'/courses',
        route:CourseRoute
    },
    {
        path:'/semester-registrations',
        route:semesterRegistrationRoutes
    },
    {
        path:'/OfferedCourse',
        route:offeredCourseRoutes
    },
    {
      path: '/auth',
      route: AuthRoutes,
    },
]


moduleRoutes.forEach(route => router.use(route.path, route.route))



export default router  