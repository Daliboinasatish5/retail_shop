import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function CustomerFeedbackPage() {
  const { shops, feedbackMessage, feedbackForm, setFeedbackForm, sendFeedback } = useOutletContext();

  return (
    <PageCard title="Feedback to Shopkeeper">
      {feedbackMessage && <p className="mb-3 rounded bg-slate-100 px-3 py-2 text-sm text-slate-700">{feedbackMessage}</p>}
      <form className="grid md:grid-cols-4 gap-2" onSubmit={sendFeedback}>
        <select
          className="border rounded p-2"
          value={feedbackForm.toUser}
          onChange={(e) => setFeedbackForm({ ...feedbackForm, toUser: e.target.value })}
        >
          <option value="">Select Shopkeeper</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
        <input
          className="border rounded p-2"
          type="number"
          min="1"
          max="5"
          value={feedbackForm.rating}
          onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
        />
        <input
          className="border rounded p-2"
          placeholder="Comment"
          value={feedbackForm.comment}
          onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
        />
        <button className="bg-indigo-600 text-white rounded p-2">Send Feedback</button>
      </form>
    </PageCard>
  );
}
