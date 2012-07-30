package cz.superobcan.web.cz.superobcan

import org.junit.Before
import org.junit.Test
import org.springframework.http.HttpMethod
import cz.urbo.cases.Feedback
import api.ApiFeedbackController


class FeedbackApiSaveHappyDayTest extends GroovyTestCase {

    @Before
    public void beforeEachTest() {

        def controller = new ApiFeedbackController()

        controller.request.contentType = "text/json"
        controller.request.content = '''

            {
                "feedback": {
                    "title": "přechod pro chodce má zelenou moc krátce",
                    "description": "podrobnější popis problému",
                    "latitude": 50.076,
                    "longitude": 14.408,
                    "photo_id": ""
                 }
            }

        '''.getBytes("utf-8")

        controller.request.requestMethod = HttpMethod.POST

        controller.save()

    }

    @Test
    public void callToJsonSaveApiShouldSaveAndTitleIsRight() {
        def feedback = Feedback.list().get(0)
        assert feedback.title == "přechod pro chodce má zelenou moc krátce"
    }

    @Test
    public void callToJsonSaveApiShouldSaveAndLatitudeIsRight() {
        def feedback = Feedback.list().get(0)
        assert feedback.location.latitude == 50.076
    }

    @Test
    public void callToJsonSaveApiShouldSaveAndLongitudeIsRight() {
        def feedback = Feedback.list().get(0)
        assert feedback.location.longitude == 14.408
    }

    @Test
    public void callToJsonSaveApiShouldSaveAndDescriptionIsRight() {
        def feedback = Feedback.list().get(0)
        assert  feedback.description == "podrobnější popis problému"
    }

}