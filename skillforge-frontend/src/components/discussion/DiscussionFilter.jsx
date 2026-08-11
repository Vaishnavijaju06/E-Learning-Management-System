export default function DiscussionFilter({
  search,
  setSearch,
  status,
  setStatus
}) {
  return (
    <div className="card border-0 mb-4">
      <div className="card-body p-3">
        <div className="row g-3 align-items-center">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0"
                placeholder="Search by title, message or student..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="ALL">All discussions</option>
              <option value="OPEN">Open</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
