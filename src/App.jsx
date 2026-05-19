import { useState, useEffect } from 'react';

const initialFeed = [
  {
    id: 1,
    author: "Senior @ Computer Science",
    trustScore: 94,
    category: "Deadlines",
    branch: "Computer Science",
    urgency: "High",
    text: "The CS department hidden registration for Machine Learning 401 opens tomorrow at 8 AM. It fills up in 3 minutes. Don't wait for the official email!",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    author: "Alumni @ Business",
    trustScore: 98,
    category: "Faculty Preference",
    branch: "Business",
    urgency: "Medium",
    text: "Prof. Davis prefers case-study answers structured using the STAR method. Avoid theoretical fluff if you want an A in FIN300.",
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    author: "Junior @ Mechanical",
    trustScore: 89,
    category: "Campus Norms",
    branch: "Mechanical",
    urgency: "Low",
    text: "The basement lab in the Engineering block is accessible 24/7 if you use the side entrance. Great for last-minute CAD project renders.",
    timestamp: "1 day ago"
  },
  {
    id: 4,
    author: "Senior @ All",
    trustScore: 99,
    category: "Hidden Recruiting",
    branch: "All",
    urgency: "High",
    text: "The local consulting firm 'Apex Partners' only recruits through the unlisted campus portal link. Apply by Friday: apex.co/campus-hidden",
    timestamp: "2 days ago"
  }
];

const initialQCQueue = [
  { id: 101, text: "The library wifi password for the guest network is 'GoBears24'.", category: "Campus Norms", author: "Freshman @ Arts" },
  { id: 102, text: "You can skip the intro prerequisite for CS101 if you email the dean directly.", category: "Faculty Preference", author: "Sophomore @ CS" }
];

export default function App() {
  const [activeView, setActiveView] = useState('feed');
  const [showBanner, setShowBanner] = useState(true);
  const [feed, setFeed] = useState(initialFeed);
  const [qcQueue, setQcQueue] = useState(initialQCQueue);
  const [toasts, setToasts] = useState([]);
  
  // Feed Filters
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  
  // Submit Form State
  const [submitCategory, setSubmitCategory] = useState('Deadlines');
  const [submitBranch, setSubmitBranch] = useState('All');
  const [submitUrgency, setSubmitUrgency] = useState('Low');
  const [submitText, setSubmitText] = useState('');
  const [submitLink, setSubmitLink] = useState('');
  
  // Admin Alert State
  const [adminAlertMsg, setAdminAlertMsg] = useState('');

  useEffect(() => {
    // Initial mock toast
    setTimeout(() => {
      addToast("Welcome back! You have 3 new critical alerts.");
    }, 1500);
  }, []);

  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const filteredFeed = feed.filter(item => {
    const matchText = item.text.toLowerCase().includes(searchText.toLowerCase()) || 
                      item.branch.toLowerCase().includes(searchText.toLowerCase());
    const matchCat = filterCategory === '' || item.category.includes(filterCategory);
    const matchUrg = filterUrgency === '' || item.urgency === filterUrgency;
    return matchText && matchCat && matchUrg;
  });

  const handleSubmitTip = (e) => {
    e.preventDefault();
    setQcQueue([
      ...qcQueue,
      {
        id: Date.now(),
        text: submitText,
        category: submitCategory,
        author: "Sarah Jenkins (You)"
      }
    ]);
    setSubmitText('');
    setSubmitLink('');
    addToast("Intelligence submitted! Pending admin verification.");
    setActiveView('admin');
  };

  const handleApproveQC = (item) => {
    setQcQueue(qcQueue.filter(q => q.id !== item.id));
    setFeed([{
      id: item.id,
      author: item.author,
      trustScore: 100,
      category: item.category,
      branch: "All",
      urgency: "Medium",
      text: item.text,
      timestamp: "Just now"
    }, ...feed]);
    addToast("Tip approved and published to global feed.");
  };

  const handleBroadcastAlert = (e) => {
    e.preventDefault();
    addToast(`Global Alert Broadcasted: ${adminAlertMsg}`);
    setAdminAlertMsg('');
  };

  return (
    <div className="app-container">
      {/* Sticky Banner */}
      {showBanner && (
        <div className="sticky-banner">
          <div className="banner-content">
            <span className="banner-icon">🚨</span>
            <span>ALERT: Scholarship portal closes in 2 hours! Freshers, submit now!</span>
          </div>
          <button className="close-btn" onClick={() => setShowBanner(false)}>&times;</button>
        </div>
      )}

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">IntelBridge</span>
        </div>
        <ul className="nav-links">
          <button className={`nav-item ${activeView === 'feed' ? 'active' : ''}`} onClick={() => setActiveView('feed')}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Feed</span>
          </button>
          <button className={`nav-item ${activeView === 'notifications' ? 'active' : ''}`} onClick={() => setActiveView('notifications')}>
            <span className="nav-icon">🔔<span className="badge">3</span></span>
            <span className="nav-label">Alerts</span>
          </button>
          <button className={`nav-item ${activeView === 'submit' ? 'active' : ''}`} onClick={() => setActiveView('submit')}>
            <span className="nav-icon">✍️</span>
            <span className="nav-label">Submit</span>
          </button>
          <button className={`nav-item ${activeView === 'admin' ? 'active' : ''}`} onClick={() => setActiveView('admin')}>
            <span className="nav-icon">🛡️</span>
            <span className="nav-label">Admin</span>
          </button>
          <button className={`nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        
        {/* View: Feed */}
        {activeView === 'feed' && (
          <section className="view active">
            <header className="view-header">
              <h1>Intelligence Feed</h1>
              <p className="subtitle">Real-time unspoken rules and institutional knowledge.</p>
            </header>
            
            <div className="filter-bar">
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search deadlines, faculty preferences..." 
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              <div className="dropdowns">
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  <option value="Deadlines">Deadlines</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Recruiting">Recruiting</option>
                  <option value="Campus Norms">Campus Norms</option>
                </select>
                <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}>
                  <option value="">All Urgency</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="feed-grid">
              {filteredFeed.length === 0 ? (
                <p className="subtitle">No intelligence matches your criteria.</p>
              ) : (
                filteredFeed.map(intel => (
                  <div key={intel.id} className="intel-card">
                    <div className="card-header">
                      <div>
                        <div className="contributor">{intel.author}</div>
                        <div className="category-tag">{intel.category} • {intel.branch}</div>
                      </div>
                      <div className="verified-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        {intel.trustScore}% Verified
                      </div>
                    </div>
                    <div className="card-body">
                      <span className={`badge urgency-${intel.urgency}`} style={{position: 'relative', top: 0, right: 0, marginRight: '5px', padding: '2px 6px'}}>
                        {intel.urgency}
                      </span>
                      {intel.text}
                    </div>
                    <div className="card-footer">
                      <button className="btn-outline">Verify Tip</button>
                      <span>{intel.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* View: Notifications */}
        {activeView === 'notifications' && (
          <section className="view active">
            <header className="view-header">
              <h1>Notification Center</h1>
              <p className="subtitle">Critical deadlines and general updates.</p>
            </header>
            <div className="notifications-layout">
              <div className="notification-section">
                <h2>Critical Deadlines</h2>
                <div className="alerts-list">
                  <div className="alert-card critical">
                    <strong>Scholarship portal closes in 2 hours!</strong>
                    <div className="alert-time">Today, 10:00 AM</div>
                  </div>
                  <div className="alert-card critical">
                    <strong>Mandatory freshman assembly registration ends tonight.</strong>
                    <div className="alert-time">Today, 11:59 PM</div>
                  </div>
                </div>
              </div>
              <div className="notification-section">
                <h2>General Updates</h2>
                <div className="alerts-list">
                  <div className="alert-card">
                    New faculty preference intel added for Mechanical Eng.
                    <div className="alert-time">Yesterday</div>
                  </div>
                  <div className="alert-card">
                    Your tip was approved and published!
                    <div className="alert-time">2 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* View: Submit */}
        {activeView === 'submit' && (
          <section className="view active">
            <header className="view-header">
              <h1>Submit Intelligence</h1>
              <p className="subtitle">Share actionable tips to help first-generation peers.</p>
            </header>
            <div className="form-card">
              <form onSubmit={handleSubmitTip}>
                <div className="form-group">
                  <label>Category</label>
                  <div className="pill-group">
                    {['Deadlines', 'Faculty Preference', 'Hidden Recruiting', 'Campus Norms'].map(cat => (
                      <button 
                        key={cat}
                        type="button" 
                        className={`pill ${submitCategory === cat ? 'active' : ''}`}
                        onClick={() => setSubmitCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Target Branch</label>
                    <select value={submitBranch} onChange={e => setSubmitBranch(e.target.value)} required>
                      <option value="All">All Branches</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Urgency Level</label>
                    <select value={submitUrgency} onChange={e => setSubmitUrgency(e.target.value)}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>The Intel (Tip)</label>
                  <textarea 
                    rows="4" 
                    placeholder="What should they know?" 
                    required
                    value={submitText}
                    onChange={e => setSubmitText(e.target.value)}
                  ></textarea>
                  <div className="char-count" style={{color: submitText.length > 280 ? 'var(--red-alert)' : 'var(--text-secondary)'}}>
                    <span>{submitText.length}</span> / 280
                  </div>
                </div>
                <div className="form-group">
                  <label>Context Link (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={submitLink}
                    onChange={e => setSubmitLink(e.target.value)}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={submitText.length === 0 || submitText.length > 280}>
                    Submit for Verification
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* View: Admin */}
        {activeView === 'admin' && (
          <section className="view active">
            <header className="view-header">
              <h1>Admin Dashboard</h1>
              <p className="subtitle">Manage information health and global alerts.</p>
            </header>
            
            <div className="summary-cards">
              <div className="stat-card">
                <div className="stat-value">4</div>
                <div className="stat-label">Active Alerts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{qcQueue.length}</div>
                <div className="stat-label">Pending Verification</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">1,402</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>

            <div className="admin-grid">
              <div className="admin-panel">
                <h2>Create Global Alert</h2>
                <form onSubmit={handleBroadcastAlert}>
                  <div className="form-group">
                    <label>Alert Message</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. System maintenance at midnight"
                      value={adminAlertMsg}
                      onChange={e => setAdminAlertMsg(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Channel</label>
                    <select>
                      <option>Dashboard Push</option>
                      <option>Email & Push</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary">Broadcast Alert</button>
                </form>
              </div>

              <div className="admin-panel">
                <h2>Content QC Queue</h2>
                <div className="table-responsive">
                  <table className="qc-table">
                    <thead>
                      <tr>
                        <th>Content Snippet</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qcQueue.map(item => (
                        <tr key={item.id}>
                          <td style={{maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            {item.text}
                          </td>
                          <td><span className="category-tag">{item.category}</span></td>
                          <td>{item.author}</td>
                          <td>
                            <button className="btn-outline" style={{padding: '0.2rem 0.5rem'}} onClick={() => handleApproveQC(item)}>
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                      {qcQueue.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)'}}>
                            Queue is empty.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* View: Profile */}
        {activeView === 'profile' && (
          <section className="view active">
            <header className="view-header">
              <h1>Your Profile</h1>
            </header>
            <div className="profile-card">
              <div className="profile-header">
                <div className="avatar">SJ</div>
                <div className="profile-info">
                  <h2>Sarah Jenkins</h2>
                  <p>Senior @ Computer Science</p>
                  <span className="badge-trust">Trust Score: 98%</span>
                </div>
              </div>
              <div className="profile-stats">
                <div className="p-stat"><strong>42</strong> Tips Submitted</div>
                <div className="p-stat"><strong>1.2k</strong> Peers Helped</div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span>🔔</span>
              <span style={{fontSize: '0.9rem', fontWeight: 500}}>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
