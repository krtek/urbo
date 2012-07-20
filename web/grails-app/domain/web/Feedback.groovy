package web

import cz.superobcan.web.FeedbackState

/**
 *
 * Feedback is created by author and in the end it's send to government/city/district representative.
 *
 */
class Feedback {

    static constraints = {

        photo nullable: true
        description nullable: true
        authorityResponse nullable: true
    }

    static embedded = ['photo','location', 'authorityResponse']

    Photo photo

    String title
    String description

    Location location

    Author author

    AuthorityResponse authorityResponse

    FeedbackState state = FeedbackState.CREATED // as this is default state
}
