package web

import grails.test.mixin.*

import admin.EmailCrudController

@TestFor(EmailCrudController)
@Mock(Email)
class EmailCrudControllerTests {

    def populateValidParams(params) {
        assert params != null
        // TODO: Populate valid properties like...
        //params["name"] = 'someValidName'
    }

    void testIndex() {
        controller.index()
        assert "/email/list" == response.redirectedUrl
    }

    void testList() {

        def model = controller.list()

        assert model.emailInstanceList.size() == 0
        assert model.emailInstanceTotal == 0
    }

    void testCreate() {
        def model = controller.create()

        assert model.emailInstance != null
    }

    void testSave() {
        controller.save()

        assert model.emailInstance != null
        assert view == '/email/create'

        response.reset()

        populateValidParams(params)
        controller.save()

        assert response.redirectedUrl == '/email/show/1'
        assert controller.flash.message != null
        assert Email.count() == 1
    }

    void testShow() {
        controller.show()

        assert flash.message != null
        assert response.redirectedUrl == '/email/list'

        populateValidParams(params)
        def email = new Email(params)

        assert email.save() != null

        params.id = email.id

        def model = controller.show()

        assert model.emailInstance == email
    }

    void testEdit() {
        controller.edit()

        assert flash.message != null
        assert response.redirectedUrl == '/email/list'

        populateValidParams(params)
        def email = new Email(params)

        assert email.save() != null

        params.id = email.id

        def model = controller.edit()

        assert model.emailInstance == email
    }

    void testUpdate() {
        controller.update()

        assert flash.message != null
        assert response.redirectedUrl == '/email/list'

        response.reset()

        populateValidParams(params)
        def email = new Email(params)

        assert email.save() != null

        // test invalid parameters in update
        params.id = email.id
        //TODO: add invalid values to params object

        controller.update()

        assert view == "/email/edit"
        assert model.emailInstance != null

        email.clearErrors()

        populateValidParams(params)
        controller.update()

        assert response.redirectedUrl == "/email/show/$email.id"
        assert flash.message != null

        //test outdated version number
        response.reset()
        email.clearErrors()

        populateValidParams(params)
        params.id = email.id
        params.version = -1
        controller.update()

        assert view == "/email/edit"
        assert model.emailInstance != null
        assert model.emailInstance.errors.getFieldError('version')
        assert flash.message != null
    }

    void testDelete() {
        controller.delete()
        assert flash.message != null
        assert response.redirectedUrl == '/email/list'

        response.reset()

        populateValidParams(params)
        def email = new Email(params)

        assert email.save() != null
        assert Email.count() == 1

        params.id = email.id

        controller.delete()

        assert Email.count() == 0
        assert Email.get(email.id) == null
        assert response.redirectedUrl == '/email/list'
    }
}
