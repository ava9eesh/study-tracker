export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center px-6">

      {/* Top Banner */}
      <div className="bg-green-600 w-full text-center py-10 rounded-xl mb-8">
        <h1 className="text-3xl font-bold">
          Free learning for everyone, forever!
        </h1>
        <p className="text-sm mt-2">
          No ads, no subscriptions — just passion ❤️
        </p>
      </div>

      {/* Content */}
      <div className="max-w-2xl text-center mb-6">
        <p className="mb-4">
          We are building a free platform for students.  
          Your support helps us keep everything free and improve faster.
        </p>

        <p>
          If you enjoy using this site, consider supporting us 🙌
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600">
          ₹100
        </button>
        <button className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600">
          ₹500
        </button>
        <button className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600">
          ₹1000
        </button>
      </div>

      {/* Donate Button */}
      <button className="bg-blue-500 px-8 py-3 rounded-lg hover:bg-blue-600">
        Donate ❤️
      </button>

    </div>
  );
}