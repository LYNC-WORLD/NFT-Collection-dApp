import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="page-not-found">
                <main className="page-content-container">
                    <h1 className="_404-text">404</h1>
                    <h2 className="page-not-found-msg">
                        You have found a secret place.
                    </h2>
                    <p className="page-not-found-description">
                        Unfortunately, this is only a 404 page. You may have
                        mistyped the address, or the page has been moved to
                        another URL.
                    </p>
                    <button
                        className="home-redirect-btn"
                        onClick={() => navigate("/")}
                    >
                        Take Me Back To Homepage
                    </button>
                </main>
            </div>
        </>
    );
};

export default PageNotFound;
