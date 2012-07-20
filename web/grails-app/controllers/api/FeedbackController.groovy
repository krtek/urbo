package api

import groovy.json.JsonBuilder
import web.Feedback

class FeedbackController {

    def index() {
        findAll()
    }

    def findAll() {
        def feedbacks = Feedback.all

        def builder = new JsonBuilder()

        def root = builder.feedbacks {
            feedbacks.each { Feedback feedbackObject ->
                feedback {
                    id feedbackObject.id
                    title feedbackObject.title
                    description feedbackObject.description
                    latitude feedbackObject.location.latitude
                    longitude feedbackObject.location.longitude
                    authority_response feedbackObject.authorityResponse
                }
            }
         }

        render(contentType: "application/json", text: builder.toString())
    }

    def findById() {
        def id = params.id

        render "case with id: ${id}"
    }

    def feedbackToJson(Feedback feedbackObject) {

        feedback {
            id feedbackObject.id
            title feedbackObject.title
            description feedbackObject.description
        }

    }


}
