/* eslint-disable react/prop-types */
const UserCard = ({ user, onEdit, onDelete }) => {
    console.log(user.username, 'from UserCard')
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
                        <ul className="flex flex-row mt-4">
                            <li className="mx-2">
                                <a href={user.github} target="_blank" aria-label="GitHub">
                                    <svg
                                        className="h-6 text-indigo-700 hover:text-indigo-300 transition-transform transform hover:scale-125"
                                        fill="currentColor"
                                        role="img"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <title>GitHub</title>
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                                    </svg>
                                </a>
                            </li>
                        </ul>
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