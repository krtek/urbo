package cz.superobcan.web

import web.Author
import web.Email
import web.Feedback
import web.Location

/**
 * Created with IntelliJ IDEA.
 * User: michal
 * Date: 7/23/12
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
class FeedbackTestUtils {

    static def createTestingFeedbacks() {

        [
                new Feedback(
                        author: new Author(
                                name: "Michal",
                                surname: "Bernhard",
                                email: new Email(address: "michal@bernhard.cz")),
                        title: "přechod pro chodce má zelenou moc krátce",
                        location: new Location(latitude: 50.076, longitude: 14.408)
                ),

                new Feedback(
                        author: new Author(
                                name: "Michal",
                                surname: "Bernhard",
                                email: new Email(address: "michal@bernhard.cz")),
                        title: "někdo hodil karamelovýho draka do pisoáru",
                        description: "děsně to zapáchá",
                        location: new Location(latitude: 50.07647, longitude: 14.40216)
                ),

                new Feedback(
                        author: new Author(
                                name: "Lukáš",
                                surname: "Marek",
                                email: new Email(address: "lukas.marek@gmail.com")),
                        title: "rozsypaná popelnice",
                        location: new Location(latitude: 50.02678, longitude: 14.43455)
                )
        ]

    }
}
