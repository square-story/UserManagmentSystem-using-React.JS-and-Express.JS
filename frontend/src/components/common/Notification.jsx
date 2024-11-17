/* eslint-disable react/prop-types */

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const notificationStyle = {
        success: 'bg-green-100 text-green-700 border-green-400',
        error: 'bg-red-100 text-red-700 border-red-400',
    };

    return (
        <div
            className={`fixed top-5 right-5 border-l-4 p-4 rounded shadow-md ${notificationStyle[type]}`}
            role="alert"
        >
            <div className="flex items-center justify-between">
                <span>{message}</span>
                <button
                    onClick={onClose}
                    className="text-lg font-bold px-2"
                >
                    Okey
                </button>
            </div>
        </div>
    );
};

export default Notification;
