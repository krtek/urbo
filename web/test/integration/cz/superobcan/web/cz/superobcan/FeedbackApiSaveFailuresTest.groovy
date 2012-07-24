package cz.superobcan.web.cz.superobcan

import api.FeedbackController
import org.apache.commons.lang.StringUtils
import org.junit.Test
import org.springframework.http.HttpMethod
import web.Feedback

class FeedbackApiSaveFailuresTest extends GroovyTestCase {

    @Test
    void shouldNotSaveWhenSaveJsonApiWithMissingTitleIsCalled() {
        def controller = new FeedbackController()

        controller.request.contentType = "text/json"
        controller.request.content = '''

            {
                "feedback": {
                    "description": "detail description here",
                    "latitude": 50.076,
                    "longitude": 14.408,
                    "photo_id": ""
                 }
            }

        '''.getBytes("utf-8")

        controller.request.requestMethod = HttpMethod.POST

        controller.save()

        assert Feedback.list().size() == 0 : "title attribute is required so without it it shouldn't be saved at all"
    }

    @Test
    void shouldResponseWithErrorJsonWhenSaveJsonApiWithMissingTitleIsCalled() {
        def controller = new FeedbackController()

        controller.request.contentType = "text/json"
        controller.request.content = '''

            {
                "feedback": {
                    "description": "detail description here",
                    "latitude": 50.076,
                    "longitude": 14.408,
                    "photo_id": ""
                 }
            }

        '''.getBytes("utf-8")

        controller.request.requestMethod = HttpMethod.POST

        controller.save()

        def expectedJson = '{"status":400,"message":"Property \'title\' cannot be \'null\'"}'

        def responseContentAsString = controller.response.text
        assert StringUtils.deleteWhitespace(responseContentAsString) == StringUtils.deleteWhitespace(expectedJson)

    }
}
