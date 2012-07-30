package cz.urbo.user

import grails.plugins.springsecurity.Secured

@Secured(['ROLE_ADMIN'])
class UserRoleController {
    static def scaffold = UserRole
}
