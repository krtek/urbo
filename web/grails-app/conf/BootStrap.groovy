import grails.util.Environment
import web.Author
import web.Case
import web.Email
import web.Location

class BootStrap {

    def init = { servletContext ->

        if (Environment.current == Environment.DEVELOPMENT) {
            println "Development environment"

            new Case(
                    author: new Author(
                                    name: "Michal",
                                    surname: "Bernhard",
                                    email: new Email(address: "michal@bernhard.cz")),
                    title: "nekdo hodil karamelovyho draka do pisoaru",
                    location: new Location(latitude: 0L, longitude: 0L)
            ).save(failOnError: true)

        }

    }
    def destroy = {
    }
}
