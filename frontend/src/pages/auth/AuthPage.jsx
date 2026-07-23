import { Link } from "react-router-dom";
import BrandLogo from "../../components/common/BrandLogo";

function AuthPage({ mode }) {
  const isLogin = mode === "login";

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="text-center mb-4"><BrandLogo /></div>
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <h1 className="h3 fw-bold text-center">{isLogin ? "Welcome back" : "Create your account"}</h1>
              <p className="text-secondary text-center">
                {isLogin ? "Login functionality arrives in Phase 4." : "Registration functionality arrives in Phase 4."}
              </p>
              <form>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email address</label>
                  <input className="form-control form-control-lg" id="email" type="email" placeholder="name@example.com" disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input className="form-control form-control-lg" id="password" type="password" placeholder="••••••••" disabled />
                </div>
                <button className="btn btn-primary btn-lg w-100" type="button" disabled>
                  Available in Phase 4
                </button>
              </form>
              <p className="small text-center mt-4 mb-0">
                {isLogin ? "New to SkillForge?" : "Already registered?"}{" "}
                <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create account" : "Login"}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
