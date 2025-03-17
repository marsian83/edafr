import api from "../../../shared/hooks/api";

interface IProps {
  selectedSessions: Array<{ id: number; quantity: number }>;
}

export default function (props: IProps) {
  const { data: sessions } = api.useSessionsList();
  const { selectedSessions } = props;

  const calculateTotal = () => {
    return selectedSessions.reduce((sum, session) => {
      return sum + sessions[session.id].unitPrice * session.quantity;
    }, 0);
  };

  if (!sessions) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-center text-2xl font-semibold">Confirm your choices</h1>

      <div className="space-y-3 mt-6">
        {selectedSessions.map((s, idx) => (
          <div key={idx} className="flex justify-between border-b pb-2 text-foreground/80">
            <span>
              {sessions[s.id].name} ({s.quantity} {sessions[s.id].billedPer}s)
            </span>
            <span>₹ {sessions[s.id].unitPrice * s.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-lg mt-3">
          <span>Total:</span>
          <span>₹ {calculateTotal()}</span>
        </div>
      </div>

      <button className="mt-6 mb-2 bg-green-700 px-4 py-2 rounded-lg">Confirm & Pay</button>
    </div>
  );
}
