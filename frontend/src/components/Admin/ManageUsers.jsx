import UserList from "./UserList"

const ManageUsers = () => {
    return (
        <div className="w-full h-screen bg-gray-900">
            <div className="flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold text-white mb-8">Manage Users</h1>
                <div className="flex flex-col space-y-10 w-full max-w-4xl overflow-y-auto h-[70vh] bg-gray-800 rounded-md p-4 shadow-md">
                    <UserList />
                </div>
            </div>
        </div>
    )
}

export default ManageUsers