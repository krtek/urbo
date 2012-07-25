package web

import cz.superobcan.web.FeedbackState
import groovy.transform.EqualsAndHashCode

/**
 *
 * Feedback is created by author and in the end it's send to government/city/district representative.
 *
 */
@EqualsAndHashCode
public class Feedback {

    //static embedded = ['photo', 'location', 'authorityResponse']

    static constraints = {
        title()
        description nullable: true
        location()
        author()
        photo nullable: true
        authorityResponse nullable: true
        state()
    }

    String title
    Photo photo
    String description
    Location location
    Author author

    AuthorityResponse authorityResponse

    FeedbackState state = FeedbackState.CREATED // as this is default state
    @Override
    String toString() {
        "${author}: ${title}"
    }
}
