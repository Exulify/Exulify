export default function register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5B9BD5] via-[#4A8BC2] to-[#2D5F7F] flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">STARBHAK</h1>
          <h2 className="text-2xl font-normal text-gray-900">Extracurricular Portal</h2>
        </div>

        <div className="space-y-3">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-5 py-3.5 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-sm"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="NIS"
              className="w-full px-5 py-3.5 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3.5 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              Doesn't have an account?
            </button>
          </div>

          <button
            type="button"
            className="w-full bg-gradient-to-r from-[#2D5F7F] to-[#1F4A61] text-white py-3.5 rounded-xl font-medium hover:from-[#234A5E] hover:to-[#183A4A] transition-all shadow-lg hover:shadow-xl text-base mt-16"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
