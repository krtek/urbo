package admin

import cz.urbo.cases.Email
import grails.plugins.springsecurity.Secured

@Secured(['ROLE_ADMIN'])
class EmailController {
    static def scaffold = Email
}
