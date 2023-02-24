import setuptools

setuptools.setup(
    name="streamlit-freegrid",
    version="0.0.1",
    author="victorC97",
    author_email="victor.cour@telecomnancy.net",
    description="Streamlit DataGrid",
    long_description="MUI DataGrid for Streamlit allowing text/images/lists",
    long_description_content_type="text/plain",
    url="https://github.com/victorC97/streamlit_freegrid",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.6",
    install_requires=[
        # By definition, a Custom Component depends on Streamlit.
        # If your component has other Python dependencies, list
        # them here.
        "streamlit >= 0.63",
    ],
    setup_requires=['wheel'],
)
