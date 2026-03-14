import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function ShopkeeperFeedbackPage() {
  const { wholesalers, feedbackForm, setFeedbackForm, sendFeedback } = useOutletContext();

  return (
    <PageCard title="Feedback to Wholesaler">
      <form className="grid md:grid-cols-4 gap-2" onSubmit={sendFeedback}>
        <select
          className="border rounded p-2"
          value={feedbackForm.toUser}
          onChange={(e) => setFeedbackForm({ ...feedbackForm, toUser: e.target.value })}
        >
          <option value="">Select Wholesaler</option>
          {wholesalers.map((wholesaler) => (
            <option key={wholesaler._id} value={wholesaler._id}>
              {wholesaler.name}
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
