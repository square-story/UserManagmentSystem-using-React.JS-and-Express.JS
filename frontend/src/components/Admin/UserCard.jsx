import SocialLinks from "../common/SocialLinks"

/* eslint-disable react/prop-types */
const UserCard = ({ user, onEdit, onDelete }) => {
    return (
        <>
            <nav className="flex min-w-[240px] flex-col gap-1 p-1.5">
                <div
                    role="button"
                    className="text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                >
                    <div className="mr-4 grid place-items-center">
                        <img
                            alt='{user?.username}'
                            src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : 'https://static.thenounproject.com/png/801397-200.png'}
                            className="relative inline-block h-24 w-24 rounded-full object-cover object-center"
                        />
                    </div>
                    <div className="flex-grow">
                        <h6 className="text-slate-800 font-medium">{user.username}</h6>
                        <p className="text-slate-500 text-sm">{user.email}</p>
                        <SocialLinks userDetails={user} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-2">
                        <button onClick={onEdit} className="bg-gray-500 text-white w-full md:w-auto md:px-10 md:py-3 sm:py-2 px-4 rounded-lg hover:bg-gray-900 hover:scale-105 transition-transform text-center">
                            Edit
                        </button>
                        <button onClick={onDelete} className="bg-red-500 text-white w-full md:w-auto md:px-10 md:py-3 sm:py-2 px-4 rounded-lg hover:bg-red-600 hover:scale-105 transition-transform text-center">
                            Delete
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default UserCard