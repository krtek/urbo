package admin

import cz.urbo.cases.Feedback
import grails.plugins.springsecurity.Secured

@Secured(['ROLE_ADMIN'])
class FeedbackController {

    static def scaffold = Feedback
}
