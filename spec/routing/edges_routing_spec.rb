require "spec_helper"

describe EdgesController do
  describe "routing" do

    it "routes to #index" do
      get("/edges").should route_to("edges#index")
    end

    it "routes to #new" do
      get("/edges/new").should route_to("edges#new")
    end

    it "routes to #show" do
      get("/edges/1").should route_to("edges#show", :id => "1")
    end

    it "routes to #edit" do
      get("/edges/1/edit").should route_to("edges#edit", :id => "1")
    end

    it "routes to #create" do
      post("/edges").should route_to("edges#create")
    end

    it "routes to #update" do
      put("/edges/1").should route_to("edges#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/edges/1").should route_to("edges#destroy", :id => "1")
    end

  end
end
