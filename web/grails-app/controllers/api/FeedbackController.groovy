package api

import groovy.json.JsonBuilder
import web.Author
import web.Email
import web.Feedback
import web.Location

class FeedbackController {

    static allowedMethods = [save: 'POST']

    def feedbackService

    def index() {
        findAll()
    }

    def findAll() {
        def feedbacks = Feedback.list()
        def feedbacksAsJson = feedbackService.convertToJson(feedbacks)
        render(contentType: "application/json", text: feedbacksAsJson)
    }

    def save() {

        def feedbackParams = request.JSON.feedback // when parseRequest in urlmapping is true then params.feedback is ok

        def feedback = new Feedback(
                                title: feedbackParams.title,
                                description: feedbackParams.description,
                                location:  new Location(latitude: feedbackParams.latitude,
                                                        longitude: feedbackParams.longitude),
                                author: new Author(
                                                name: "Urbo",
                                                surname: "TheGreat",
                                                email: new Email(address: "urbo@urbo.eu")))

        feedback.save()

        //TODO: mbernhard - reakce na chybove stavy

        render '{ "info": "succesfully saved" }'

    }

    def findById() {
        def feedbackParam = params.id
        def feedback = Feedback.findById(feedbackParam)

        if (feedback == null) {

           //TODO michal : tbd reaction of api error (ie. nothing found)

        }
        else {
            def feedbacksAsJson = feedbackService.convertToJson(feedback)
            render(contentType: "application/json", text: feedbacksAsJson)
        }



    }

    def handleError() {

        render "shit happened, try it later mate"

    }



}
