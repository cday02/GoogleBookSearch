import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import DeleteBtn from "../../components/DeleteBtn";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, TextArea, FormBtn } from "../../components/Form";
import GoogleAPI from "../../utils/GoogleAPI"

class Books extends Component {
  // Setting our component's initial state
  state = {
    books: [],
    search: ""
  };

  // When the component mounts, load all books and save them to this.state.books
  componentDidMount() {
    this.loadBooks();
  }

  // Loads all books  and sets them to this.state.books
  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  // Deletes a book from the database with a given id, then reloads books from the db
  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  // Handles updating component state when the user types into the input field
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault()
   let id = event.target.id
    API.saveBook({ 
      title: this.state.books[id].volumeInfo.title,
      author: this.state.books[id].volumeInfo.author,
      description: this.state.books[id].volumeInfo.description,
      link: this.state.books[id].volumeInfo.infoLink,
      image: this.state.books[id].volumeInfo.thumbnail,
     })
     .then(res => console.log("success"))
     .catch(err => console.log(err))
  }

  // When the form is submitted, use the API.saveBook method to save the book data
  // Then reload books from the database
  apiSearch = event => {
    event.preventDefault();
    if (this.state.search) {
      GoogleAPI.searchBook(
          this.state.search
      )
        .then(res => this.setState({books:res.data.items
        }))
        .catch(err => console.log(err));
    }
  };

  render() {
    const {books}=this.state
    return (
      <Container fluid>
          <Col size="md-12">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.search}
                onChange={this.handleInputChange}
                name="search"
                placeholder="Search (required)"
              />
              
              <FormBtn
                disabled={!(this.state.search)}
                onClick={this.apiSearch}
              >
                Submit Book
              </FormBtn>
            </form>
          </Col>
          <Row>
              <Col size="md-6" />
              <Col size="md-12 md-12">
                {this.state.books.length ? (
                  
                  <List>
                    {this.state.books.map((book, index) => {
                      return (
                        <ListItem key={book.id}>
                          <a>
                            <h3 name="title">
                              <a
                                href={book.volumeInfo.infoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {book.volumeInfo.title}
                              </a>
                            </h3>
                            <h6>{book.volumeInfo.subtitle}</h6>
                            <h5 name="authors">
                              Written by {book.volumeInfo.authors[0]}
                            </h5>
                            <br />
                            <div className="card">
                              <div className="img-container">
                                <img
                                  name="link"
                                  value={this.state.link}
                                  alt={book.volumeInfo.title}
                                  src={book.volumeInfo.imageLinks.thumbnail}
                                  name="image"
                                />
                              </div>
                            </div>
                            <p name="description">
                              {book.volumeInfo.description}
                            </p>
                            <DeleteBtn
                              id={index}
                              onClick={this.handleFormSubmit}
                              hidden={false}
                            >
                              Save This Book
                            </DeleteBtn>
                          </a>
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <h3>No Results to Display</h3>
                )}
              </Col>
            </Row>
     </Container>
    );
  }
}

export default Books;
