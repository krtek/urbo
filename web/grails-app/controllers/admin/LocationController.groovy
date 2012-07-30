package admin

import cz.urbo.cases.Location
import grails.plugins.springsecurity.Secured

@Secured(['ROLE_ADMIN'])
class LocationController {
    static def scaffold = Location
}
