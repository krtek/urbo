package api

class CaseController {

    def index() {
        findAll()
    }

    def findAll() {
        render "list of all cases here"
    }

    def findById() {
        def id = params.id

        render "case with id: ${id}"
    }


}
