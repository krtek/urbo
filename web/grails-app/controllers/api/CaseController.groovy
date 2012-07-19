package api

import groovy.json.JsonBuilder
import web.Feedback

class CaseController {

    def index() {
        findAll()
    }

    def findAll() {
        def feedbacks = Feedback.all

        def builder = new JsonBuilder()

        def root = builder.feedbacks {
            feedbacks.each { feedbackObject ->
                feedback {
                    id feedbackObject.id
                    title feedbackObject.title
                    description feedbackObject.description
                }
            }
         }

        render(contentType: "application/json", text: builder.toString())
    }

    def findById() {
        def id = params.id

        render "case with id: ${id}"
    }


}
