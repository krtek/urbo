import cz.superobcan.web.FeedbackTestUtils
import grails.util.Environment
import web.Author
import web.Feedback
import web.Email
import web.Feedback
import web.Location
import cz.urbo.user.UserRole
import cz.urbo.user.Role
import cz.urbo.user.User

class BootStrap {

    def init = { servletContext ->

        if (Environment.current == Environment.DEVELOPMENT) {
            println "Development environment"

            FeedbackTestUtils.createTestingFeedbacks()*.save()

            def adminRole = new Role(authority: 'ROLE_ADMIN').save(flush: true)
            def userRole = new Role(authority: 'ROLE_USER').save(flush: true)

            def testUser = new User(username: 'me', enabled: true, password: 'password')
            testUser.save(flush: true)

            UserRole.create testUser, adminRole, true
        }

    }
    def destroy = {
    }
}
