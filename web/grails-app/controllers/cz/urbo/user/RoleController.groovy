package cz.urbo.user

import grails.plugins.springsecurity.Secured

@Secured(['ROLE_ADMIN'])
class RoleController {
    static def scaffold = Role
}
