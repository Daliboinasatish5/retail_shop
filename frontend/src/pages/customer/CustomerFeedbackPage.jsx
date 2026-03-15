import { useOutletContext } from "react-router-dom";

export default function CustomerFeedbackPage() {
  const { shops, feedbackMessage, feedbackForm, setFeedbackForm, sendFeedback } = useOutletContext();

  return (
    <div className="cu-card">
      <div className="cu-card-head">Feedback to Shopkeeper</div>
      <div className="cu-card-body">
        {feedbackMessage && <p className="mb-3 cu-soft text-sm cu-text">{feedbackMessage}</p>}
        <form className="cu-grid-4" onSubmit={sendFeedback}>
          <select
            className="cu-input cu-select"
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
            className="cu-input"
            type="number"
            min="1"
            max="5"
            value={feedbackForm.rating}
            onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
          />
          <input
            className="cu-input"
            placeholder="Comment"
            value={feedbackForm.comment}
            onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
          />
          <button className="cu-btn-primary" type="submit">Send Feedback</button>
        </form>
      </div>
    </div>
  );
}
