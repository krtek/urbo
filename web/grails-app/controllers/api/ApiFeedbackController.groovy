package api

import cz.urbo.web.api.utils.org.apache.commons.httpclient.HttpStatus
import groovy.json.JsonBuilder
import web.Author
import web.Email
import web.Feedback
import web.Location
import web.Photo

/**
 * This is WEB API of URBO Application
 */
class ApiFeedbackController {

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

    /**
     * This action is used to save feedback through JSON post request.
     */
    def save() {

        def feedbackParams = request.JSON.feedback // when parseRequest in urlmapping is true then params.feedback is ok
        def author = new Author(
                name: "Urbo",
                surname: "TheGreat",
                email: new Email(address: "urbo@urbo.eu"))

        author.save()

        def feedback = new Feedback(
                                title: feedbackParams.title,
                                description: feedbackParams.description,
                                location: new Location(latitude: feedbackParams.latitude,
                                                        longitude: feedbackParams.longitude),
                                author: author)
        if(!feedback.save(failOnError: false, flush: true)) {

            def allErrorsAsText =
                           feedback.errors.allErrors.collect {
                                "Property '${it.field}' cannot be '${it.rejectedValue}'"
                           }.join("\n")

            def json = new JsonBuilder(
                                "status": HttpStatus.SC_BAD_REQUEST, /* 400 - Bad Request -
                                                  this should be the same as http response code we use,
                                                  because developer  can work directly with json response
                                                  and don't have to use http status codes to detect errors..
                                                  or he can */
                                "message": allErrorsAsText)

            render (
                  contentType: "application/json",
                  text: json.toPrettyString(),
                  status: HttpStatus.SC_BAD_REQUEST, /* HttpCode for Bad Request */
                  encoding: "utf-8")

        }
        else {
            def json = new JsonBuilder(
                                status: HttpStatus.SC_OK,
                                message: "Feedback has been successfully saved - id of saved feedback is accessible " +
                                         "in 'feedback_id' property of this response.",
                                feedback_id: feedback.id)

            render (
                    status: HttpStatus.SC_OK,
                    contentType: "application/json",
                    text: json.toPrettyString(),
                    encoding: "utf-8"
            )
        }


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

    def uploadPhoto() {

        def uploadedFile = request.getFile("file")
        def photo = new Photo()
        photo.data = uploadedFile.getBytes()

        photo.save()

        // TODO mbernhard : exception reaction

        def jsonBuilder = new JsonBuilder(
                                status: HttpStatus.SC_OK,
                                message:
                                        "File uploaded successfully and saved with id ${photo.id}. " +
                                        "Use this id when creating new feedback through api as photoId parameter." +
                                        "PhotoId is easily accessible as photoId parameter of this response object.",
                                photoId: photo.id)

        def jsonResponse = jsonBuilder.toPrettyString()

        render(status: HttpStatus.SC_OK, contentType: "application/json", text: jsonResponse)

    }

}
