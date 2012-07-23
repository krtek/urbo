import cz.superobcan.web.FeedbackTestUtils
import grails.util.Environment
import web.Author
import web.Feedback
import web.Email
import web.Feedback
import web.Location

class BootStrap {

    def init = { servletContext ->

        if (Environment.current == Environment.DEVELOPMENT) {
            println "Development environment"

            FeedbackTestUtils.createTestingFeedbacks()*.save()

        }

    }
    def destroy = {
    }
}
