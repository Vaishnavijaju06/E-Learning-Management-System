function DashboardStatCard({ statistic }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="text-secondary mb-2">{statistic.title}</p>
            <h2 className="fw-bold mb-0">{statistic.value}</h2>
          </div>

          <div
            className={`dashboard-stat-icon bg-${statistic.color}-subtle text-${statistic.color}`}
          >
            <i className={`bi ${statistic.icon}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStatCard;