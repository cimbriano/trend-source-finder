require 'spec_helper'

describe "edges/show" do
  before(:each) do
    @edge = assign(:edge, stub_model(Edge))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
