require 'spec_helper'

describe "edges/index" do
  before(:each) do
    assign(:edges, [
      stub_model(Edge),
      stub_model(Edge)
    ])
  end

  it "renders a list of edges" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
