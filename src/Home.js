import lyncIcon from "./assets/lync-icon.svg";

const HomePage = () => {
    return (
        <>
            <div className="homepage">
                <main className="homepage-content">
                    <span className="lync-icon">
                        <img src={lyncIcon} alt="lync_icon" />
                    </span>
                    <h1 className="homepage-heading">
                        Building Your Claimer, We Simplify This For You! <br />{" "}
                        Use This Boilerplate and Get Going... !
                    </h1>
                    <p className="homepage-description">
                        Don&apos;t forget to explore the world of{" "}
                        <a
                            href="https://lync.world/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LYNC
                        </a>{" "}
                        though !!
                    </p>
                    <a
                        href="https://betanft.lync.world/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nft-deployer-link"
                    >
                        Try Deploying Your NFT
                    </a>
                </main>
            </div>
        </>
    );
};

export default HomePage;
