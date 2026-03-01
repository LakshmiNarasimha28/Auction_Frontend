const PaymentMethod = ({ onOnlinePayment, onDirectPayment, processing }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>

      {/* Online Payment */}
      <button
        onClick={onOnlinePayment}
        disabled={processing}
        className="w-full bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-sm hover:shadow group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg">Pay Online</h4>
              <p className="text-sm text-blue-100">Secure payment via Razorpay</p>
            </div>
          </div>
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Instant confirmation • Credit/Debit Card, UPI, Net Banking</span>
        </div>
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-gray-500 text-sm font-medium">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Direct Payment */}
      <button
        onClick={onDirectPayment}
        disabled={processing}
        className="w-full bg-white border-2 border-gray-300 text-gray-900 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 disabled:bg-gray-100 disabled:border-gray-200 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 group-hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-gray-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg">Direct Payment</h4>
              <p className="text-sm text-gray-600 group-hover:text-green-700">Pay directly to seller</p>
            </div>
          </div>
          <svg className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 group-hover:text-green-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Requires seller confirmation • Bank transfer, Cash, etc.</span>
        </div>
      </button>

      {processing && (
        <div className="flex items-center justify-center gap-2 text-gray-600 py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm font-medium">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
