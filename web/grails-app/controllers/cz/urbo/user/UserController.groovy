package cz.urbo.user

import grails.plugins.springsecurity.Secured

@Secured(['ROLE_ADMIN'])
class UserController {
    static def scaffold = User
}
