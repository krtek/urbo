package admin

import cz.urbo.cases.Photo
import grails.plugins.springsecurity.Secured

@Secured(['ROLE_ADMIN'])
class PhotoController {
    static def scaffold = Photo
}
