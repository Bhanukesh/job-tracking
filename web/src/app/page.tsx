export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Job Application Dashboard</h1>
            
            {/* Dashboard stats will go here */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-600">Total Applications</h3>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-600">Active</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-600">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-600">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-600">Rejected</h3>
                    <p className="text-3xl font-bold text-red-600">0</p>
                </div>
            </div>

            {/* Recent Activity section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-500">No recent applications found.</p>
            </div>
        </div>
    );
}