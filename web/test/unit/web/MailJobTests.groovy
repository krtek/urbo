package web

import static org.junit.Assert.*

import grails.test.mixin.*
import grails.test.mixin.support.*
import org.junit.*
import grails.test.MockUtils
import cz.superobcan.web.FeedbackTestUtils

/**
 * See the API for {@link grails.test.mixin.support.GrailsUnitTestMixin} for usage instructions
 */
@TestMixin(GrailsUnitTestMixin)
@Mock([Feedback])
class MailJobTests {

    def MailJob mailJob

    void setUp() {
        MockUtils.mockDomain(Feedback, FeedbackTestUtils.createTestingFeedbacks())
        //no autowiring for jobs :/
        mailJob = new MailJob()
    }

    void tearDown() {
        // Tear down logic here
    }

    @Test
    void testFindFeedbacks() {
        def feedbacks = mailJob.findReadyFeedbacks()
        assertEquals("There are two feedbacks to send", 0, feedbacks.size())
    }

    @Test
    void formatSubject() {
        def subjectLine = mailJob.formatSubject("Rozsypaná popelnice")
        assertEquals("[Urbo] Rozsypaná popelnice", subjectLine)
    }


    @Test
    void sendMail() {

    }
}
