package cz.superobcan.web


public enum FeedbackState {

    /**
     * when feedback is first created by user
     */
    CREATED,

    /**
     * when government authority (ward's council...etc.) was informed about citizen's feedback
     */
    SENT_TO_AUTHORITY,

    /**
     * reported issue (feedback) is fixed
     */
    FIXED


}
