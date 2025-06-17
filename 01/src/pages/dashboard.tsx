// import { cookies } from 'next/headers'
// import { verifyToken } from '@/lib/auth'
// import prisma from '@/lib/db'
// import Link from 'next/link'

// export default async function DashboardPage() {
//   const token = cookies().get('token')?.value || ''
//   const payload = verifyToken(token)

//   if (!payload) {
//     return (
//       <div className="text-center mt-10">
//         <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
//         <p>Please login to access this page</p>
//         <Link
//           href="/login"
//           className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Login
//         </Link>
//       </div>
//     )
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: payload.userId },
//     select: { id: true, email: true, name: true, createdAt: true },
//   })

//   if (!user) {
//     return (
//       <div className="text-center mt-10">
//         <h1 className="text-2xl font-bold mb-4">User not found</h1>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
//       <div className="space-y-4">
//         <p>
//           <span className="font-semibold">Name:</span> {user.name || 'Not provided'}
//         </p>
//         <p>
//           <span className="font-semibold">Email:</span> {user.email}
//         </p>
//         <p>
//           <span className="font-semibold">Member since:</span>{' '}
//           {new Date(user.createdAt).toLocaleDateString()}
//         </p>
//       </div>
//     </div>
//   )
// }