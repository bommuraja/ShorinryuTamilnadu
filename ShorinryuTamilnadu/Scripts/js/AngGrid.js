
//Demo of Searching Sorting and Pagination of Table with AngularJS - Advance Example

var myApp = angular.module('myApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);


//Not Necessary to Create Service, Same can be done in COntroller also as method like add() method
myApp.service('filteredListService', function () {

    this.searched = function (valLists, toSearch) {
        return _.filter(valLists,

            function (i) {
                /* Search Text in all 3 fields */
                return searchUtil(i, toSearch);
            });
    };

    this.paged = function (valLists, rowsPerPage, itemsPerRow) {
        retVal = [];
        valLists = listToMatrix(valLists, itemsPerRow);
        //valLists[0].IsFirstItemOfRow = true;
        for (var i = 0; i < valLists.length; i++) {
            if (i % rowsPerPage === 0) {
                retVal[Math.floor(i / rowsPerPage)] = [valLists[i]];
            } else {
                retVal[Math.floor(i / rowsPerPage)].push(valLists[i]);
            }

        }
        return retVal;
    };

});

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

//Inject Custom Service Created by us and Global service $filter. This is one way of specifying dependency Injection
var TableCtrl = myApp.controller('TableCtrl', function ($scope, $mdDialog, $filter, filteredListService) {

    $scope.rowsPerPage = 4;
    $scope.itemsPerRow = 4;
    $scope.allItems = getDummyData();
    $scope.reverse = false;

    $scope.resetAll = function () {
        $scope.filteredList = $scope.allItems;
        $scope.newEmpId = '';
        $scope.newName = '';
        $scope.newEmail = '';
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ['', '', ''];
    }

    $scope.add = function () {
        $scope.allItems.push({
            EmpId: $scope.newEmpId,
            name: $scope.newName,
            Email: $scope.newEmail
        });
        $scope.resetAll();
    }

    $scope.search = function () {
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText);

        if ($scope.searchText == '') {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }

    // Calculate Total Number of Pages based on Search Result
    $scope.pagination = function () {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.rowsPerPage, $scope.itemsPerRow);
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    $scope.firstPage = function () {
        $scope.currentPage = 0;
    };

    $scope.lastPage = function () {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };

    $scope.previousPage = function () {
        $scope.currentPage = $scope.currentPage - 1;
    };
    $scope.nextPage = function () {
        $scope.currentPage = $scope.currentPage + 1;
    };


    $scope.range = function (input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    };

    $scope.sort = function (sortBy) {
        $scope.resetAll();

        $scope.columnToOrder = sortBy;

        //$Filter - Standard Service
        $scope.filteredList = $filter('orderBy')($scope.filteredList, $scope.columnToOrder, $scope.reverse);

        if ($scope.reverse) iconName = 'glyphicon glyphicon-chevron-up';
        else iconName = 'glyphicon glyphicon-chevron-down';

        if (sortBy === 'EmpId') {
            $scope.Header[0] = iconName;
        } else if (sortBy === 'name') {
            $scope.Header[1] = iconName;
        } else {
            $scope.Header[2] = iconName;
        }

        $scope.reverse = !$scope.reverse;

        $scope.pagination();
    };

    //By Default sort ny Name
    $scope.sort('name');

    // Picture click event
    $scope.onPicClick = function (event) {
        alert($(event.target).attr("height"));
    }


    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };




    function DialogController($scope, $mdDialog, filteredListService) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
        $scope.rowsPerPage = 1;
        $scope.itemsPerRow = 2;
        $scope.allItems = getDummyDataChildOne();
        $scope.reverse = false;

        $scope.resetAll = function () {
            $scope.filteredList = $scope.allItems;
            $scope.newEmpId = '';
            $scope.newName = '';
            $scope.newEmail = '';
            $scope.searchText = '';
            $scope.currentPage = 0;
            $scope.Header = ['', '', ''];
        }

        $scope.add = function () {
            $scope.allItems.push({
                EmpId: $scope.newEmpId,
                name: $scope.newName,
                Email: $scope.newEmail
            });
            $scope.resetAll();
        }

        $scope.search = function () {
            $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText);

            if ($scope.searchText == '') {
                $scope.filteredList = $scope.allItems;
            }
            $scope.pagination();
        }

        // Calculate Total Number of Pages based on Search Result
        $scope.pagination = function () {
            $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.rowsPerPage, $scope.itemsPerRow);
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

        $scope.firstPage = function () {
            $scope.currentPage = 0;
        };

        $scope.lastPage = function () {
            $scope.currentPage = $scope.ItemsByPage.length - 1;
        };

        $scope.previousPage = function () {
            $scope.currentPage = $scope.currentPage - 1;
        };
        $scope.nextPage = function () {
            $scope.currentPage = $scope.currentPage + 1;
        };


        $scope.range = function (input, total) {
            var ret = [];
            if (!total) {
                total = input;
                input = 0;
            }
            for (var i = input; i < total; i++) {
                if (i != 0 && i != total - 1) {
                    ret.push(i);
                }
            }
            return ret;
        };

        $scope.sort = function () {
            $scope.resetAll();


            //$Filter - Standard Service
            $scope.filteredList = $filter('orderBy')($scope.filteredList, $scope.columnToOrder, $scope.reverse);



            $scope.pagination();
        };

        //By Default sort ny Name
        $scope.sort();

        // Picture click event
        $scope.onPicClick = function (event) {
            alert($(event.target).attr("height"));
        }
    }

});

function searchUtil(item, toSearch) {
    /* Search Text in all 3 fields */
    return (item.name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Email.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.EmpId == toSearch) ? true : false;
}

function getDummyDataOne() {
    return [{
        ProductPictureUrl: 'http://s3.amazonaws.com/digitaltrends-uploads-prod/2016/01/News-Apps-Header.jpg'
        , ProductName: 'Name 101'
        , ProductSize: '1'
        , ProductPrice: '1001'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/water_waterfall_nature_214751.jpg'
        , ProductName: 'Name 102'
        , ProductSize: '2'
        , ProductPrice: '1002'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/beautiful_nature_landscape_05_hd_picture_166223.jpg'
        , ProductName: 'Name 103'
        , ProductSize: '3'
        , ProductPrice: '1003'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/beautiful_nature_landscape_02_hd_picture_166206.jpg'
        , ProductName: 'Name 104'
        , ProductSize: '4'
        , ProductPrice: '1004'
        , IsFirstItemOfRow: false
    }];
}
/*Get Dummy Data for Example*/
function getDummyData() {
    return [{
        ProductPictureUrl: 'http://s3.amazonaws.com/digitaltrends-uploads-prod/2016/01/News-Apps-Header.jpg'
        , ProductName: 'Name 101'
        , ProductSize: '1'
        , ProductPrice: '1001'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'https://scontent.fmaa2-1.fna.fbcdn.net/v/t1.0-9/10177479_392976674185268_6548525571139328532_n.jpg?oh=a8ab59f8f5acba7cc6efc58880e9af26&oe=5B4611C5'
        , ProductName: 'Name 102'
        , ProductSize: '2'
        , ProductPrice: '1002'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/beautiful_nature_landscape_05_hd_picture_166223.jpg'
        , ProductName: 'Name 103'
        , ProductSize: '3'
        , ProductPrice: '1003'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/beautiful_nature_landscape_02_hd_picture_166206.jpg'
        , ProductName: 'Name 104'
        , ProductSize: '4'
        , ProductPrice: '1004'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/new_jersey_spring_nature_215447.jpg'
        , ProductName: 'Name 105'
        , ProductSize: '5'
        , ProductPrice: '1005'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'https://ae01.alicdn.com/kf/HTB17RHwMXXXXXcfXpXXq6xXFXXXq/2016-newest-Ariel-princess-Hello-Kitty-Summer-cloth-Girl-s-Clothing-2pcs-Set.jpg',
        ProductName: 'Name 106',
        ProductSize: '6',
        ProductPrice: '1006'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://moziru.com/images/falling-clipart-clothes-for-kid-20.jpg',
        ProductName: 'Name 107',
        ProductSize: '7',
        ProductPrice: '1007'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'https://sg-live-02.slatic.net/p/7/shoes-tide-shoes-korean-style-youth-sports-casual-flat-shoes-mencanvas-shoes-men-summer-new-style-lace-breathable-cloth-ouma-42-blue-1496829613-22531392-fc60cd5b7830a89191c0dd2fa7a8eedb-product.jpg',
        ProductName: 'Name 108',
        ProductSize: '8',
        ProductPrice: '1008'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/canoe_water_nature_221611.jpg',
        ProductName: 'Name 109',
        ProductSize: '9',
        ProductPrice: '1009'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'https://lh3.googleusercontent.com/iKEdGSVTh06yriQ3o6vrW_nn-SMF8yxFMXZ0Hem32hMkt2Jxg89pnbf9BFgB9YaYj0o=h310',
        ProductName: 'Name 110',
        ProductSize: '10',
        ProductPrice: '1010'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://mediad.publicbroadcasting.net/p/radiowest/files/styles/x_large/public/201611/lost_art_natural_navigation.jpg',
        ProductName: 'Name 111',
        ProductSize: '11',
        ProductPrice: '1011'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://www.indiacelebrating.com/wp-content/uploads/Natural-resources.jpg',
        ProductName: 'Name 112',
        ProductSize: '12',
        ProductPrice: '1012'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://healthcrunch360.com/wp-content/uploads/natural-health.jpeg',
        ProductName: 'Name 113',
        ProductSize: '13',
        ProductPrice: '1013'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://www.knowmycotoxins.com/sites/default/files/images/pets.jpg',
        ProductName: 'Name 114',
        ProductSize: '14',
        ProductPrice: '1014'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://r.ddmcdn.com/s_f/o_1/cx_0/cy_934/cw_1406/ch_1406/w_720/APL/uploads/2014/12/pets-dogs.jpg',
        ProductName: 'Name 115',
        ProductSize: '15',
        ProductPrice: '1015'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'https://images-na.ssl-images-amazon.com/images/G/15/img16/pet-products/content-grid/981163_CA_pets_cg_fish_1340x762_EN.jpg',
        ProductName: 'Test 116',
        ProductSize: '16',
        ProductPrice: '1016'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'https://auto.ndtvimg.com/car-images/medium/tata/tiago/tata-tiago.jpg?v=40',
        ProductName: 'Test 117',
        ProductSize: '17',
        ProductPrice: '1017'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'https://carsales.li.csnstatic.com/carsales/general/editorial/171016_Hyundai_Tucson_Highlander_01.jpg?aspect=centered&height=400&width=620',
        ProductName: 'Test 118',
        ProductSize: '18',
        ProductPrice: '1018'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://d1arsn5g9mfrlq.cloudfront.net/sites/default/files/2014_toyota_corolla_l_005_720_4.jpg',
        ProductName: 'Test 119',
        ProductSize: '19',
        ProductPrice: '1019'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://www.topgear.com/india/images/stories/tata%20zica%20web%20review%203.jpg',
        ProductName: 'Test 120',
        ProductSize: '20',
        ProductPrice: '1020'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://4.bp.blogspot.com/-x4-8N8qFBWo/TiEo7qRXHoI/AAAAAAAAClE/KCtqny6x0WI/s1600/swift+car+rental-2.jpg',
        ProductName: 'Test 121',
        ProductSize: '21',
        ProductPrice: '1021'
        , IsFirstItemOfRow: false
    }];
}

function getDummyDataChildOne() {
    return [{
        ProductPictureUrl: 'http://s3.amazonaws.com/digitaltrends-uploads-prod/2016/01/News-Apps-Header.jpg'
        , ProductName: 'Name 101'
        , ProductSize: '1'
        , ProductPrice: '1001'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/water_waterfall_nature_214751.jpg'
        , ProductName: 'Name 102'
        , ProductSize: '2'
        , ProductPrice: '1002'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/beautiful_nature_landscape_05_hd_picture_166223.jpg'
        , ProductName: 'Name 103'
        , ProductSize: '3'
        , ProductPrice: '1003'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/beautiful_nature_landscape_02_hd_picture_166206.jpg'
        , ProductName: 'Name 104'
        , ProductSize: '4'
        , ProductPrice: '1004'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'http://images.all-free-download.com/images/graphiclarge/new_jersey_spring_nature_215447.jpg'
        , ProductName: 'Name 105'
        , ProductSize: '5'
        , ProductPrice: '1005'
        , IsFirstItemOfRow: false
    }, {
        ProductPictureUrl: 'https://ae01.alicdn.com/kf/HTB17RHwMXXXXXcfXpXXq6xXFXXXq/2016-newest-Ariel-princess-Hello-Kitty-Summer-cloth-Girl-s-Clothing-2pcs-Set.jpg',
        ProductName: 'Name 106',
        ProductSize: '6',
        ProductPrice: '1006'
        , IsFirstItemOfRow: false
    }];
}
