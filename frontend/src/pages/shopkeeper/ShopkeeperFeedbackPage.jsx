import { useOutletContext } from "react-router-dom";

export default function ShopkeeperFeedbackPage() {
  const { wholesalers, feedbackForm, setFeedbackForm, sendFeedback } = useOutletContext();

  return (
    <div className="sk-page">
      <div className="sk-card">
        <div className="sk-card-head">Feedback to Wholesaler</div>
        <div className="sk-card-body">
      <form className="grid md:grid-cols-4 gap-2" onSubmit={sendFeedback}>
        <select
          className="sk-input"
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
          className="sk-input"
          type="number"
          min="1"
          max="5"
          value={feedbackForm.rating}
          onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
        />
        <input
          className="sk-input"
          placeholder="Comment"
          value={feedbackForm.comment}
          onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
        />
        <button className="sk-btn-primary">Send Feedback</button>
      </form>
        </div>
      </div>
    </div>
  );
}
