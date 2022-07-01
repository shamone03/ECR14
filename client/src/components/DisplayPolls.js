import styles from "../css/PollStyles.module.css";
import React from "react";

const DisplayPolls = ({polls, whenPollClicked}) => {
    return (
        <div className={styles.allPollsWrapper}>
            {polls.map((p) => (
                <div onClick={() => whenPollClicked(p)} className={`px-3 py-3 ${styles.pollStyle}`} key={p._id}>
                    <div>
                        <h2>{p.position.toUpperCase()}</h2>
                        <p style={{wordWrap: 'break-word'}}>{p.description.substring(0, Math.min(p.description.length, 50)) + '...'}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DisplayPolls