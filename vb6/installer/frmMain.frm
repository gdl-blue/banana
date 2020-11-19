VERSION 5.00
Begin VB.Form frmMain 
   BorderStyle     =   1  '단일 고정
   Caption         =   "바나나 설치 프로그램"
   ClientHeight    =   5640
   ClientLeft      =   45
   ClientTop       =   345
   ClientWidth     =   7440
   Icon            =   "frmMain.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   5640
   ScaleWidth      =   7440
   StartUpPosition =   2  '화면 가운데
   Begin VB.ComboBox txtSkin 
      Height          =   300
      Left            =   1920
      Style           =   2  '드롭다운 목록
      TabIndex        =   12
      Top             =   2520
      Width           =   4335
   End
   Begin VB.DirListBox dir 
      Height          =   300
      Left            =   6120
      TabIndex        =   11
      Top             =   4920
      Visible         =   0   'False
      Width           =   975
   End
   Begin VB.TextBox txtSecret 
      Height          =   270
      IMEMode         =   3  '사용 못함
      Left            =   1920
      PasswordChar    =   "*"
      TabIndex        =   6
      Top             =   2040
      Width           =   4335
   End
   Begin VB.TextBox txtPort 
      Height          =   270
      Left            =   1920
      TabIndex        =   4
      Text            =   "80"
      Top             =   1560
      Width           =   4335
   End
   Begin VB.TextBox txtHost 
      Height          =   270
      Left            =   1920
      TabIndex        =   2
      Text            =   "127.0.0.1"
      Top             =   1080
      Width           =   4335
   End
   Begin VB.CommandButton cmdInstall 
      Caption         =   "시 작 !"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   2880
      TabIndex        =   0
      Top             =   4920
      Width           =   1695
   End
   Begin VB.Label Label7 
      BackStyle       =   0  '투명
      Caption         =   "기 본   스 킨 :"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   10
      Top             =   2520
      Width           =   1455
   End
   Begin VB.Label Label6 
      BackStyle       =   0  '투명
      Caption         =   $"frmMain.frx":0442
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   600
      TabIndex        =   9
      Top             =   3960
      Width           =   6255
   End
   Begin VB.Label Label5 
      BackStyle       =   0  '투명
      Caption         =   $"frmMain.frx":051C
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   600
      TabIndex        =   8
      Top             =   3360
      Width           =   6255
   End
   Begin VB.Label Label4 
      Alignment       =   2  '가운데 맞춤
      BackStyle       =   0  '투명
      Caption         =   "엔 진   설 치 를   시 작 합 니 다 .   정 보 를    정 확 히    입 력 해 주 세 요 ~ ^^"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   7
      Top             =   360
      Width           =   6855
   End
   Begin VB.Label Label3 
      BackStyle       =   0  '투명
      Caption         =   "세 션   비밀  키 :"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   5
      Top             =   2040
      Width           =   1455
   End
   Begin VB.Label Label2 
      BackStyle       =   0  '투명
      Caption         =   "포 트 :"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   3
      Top             =   1560
      Width           =   1455
   End
   Begin VB.Label Label1 
      BackStyle       =   0  '투명
      Caption         =   "호 스 트  주 소 :"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   1
      Top             =   1080
      Width           =   1455
   End
   Begin VB.Shape Shape3 
      BackStyle       =   1  '투명하지 않음
      Height          =   1695
      Left            =   360
      Shape           =   4  '둥근 사각형
      Top             =   3120
      Width           =   6735
   End
   Begin VB.Shape Shape2 
      BackStyle       =   1  '투명하지 않음
      Height          =   2055
      Left            =   240
      Shape           =   4  '둥근 사각형
      Top             =   840
      Width           =   6255
   End
   Begin VB.Shape Shape1 
      BackStyle       =   1  '투명하지 않음
      Height          =   615
      Left            =   360
      Shape           =   4  '둥근 사각형
      Top             =   120
      Width           =   6855
   End
   Begin VB.Image imgDay 
      Height          =   5685
      Left            =   0
      Picture         =   "frmMain.frx":05BE
      Top             =   0
      Visible         =   0   'False
      Width           =   7545
   End
   Begin VB.Image imgSunset 
      Height          =   5760
      Left            =   0
      Picture         =   "frmMain.frx":3AFA
      Top             =   0
      Visible         =   0   'False
      Width           =   7500
   End
   Begin VB.Image imgNight 
      Height          =   5940
      Left            =   0
      Picture         =   "frmMain.frx":A0FD
      Top             =   0
      Visible         =   0   'False
      Width           =   7545
   End
End
Attribute VB_Name = "frmMain"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Dim iscomplete As Boolean

'https://www.vbforums.com/showthread.php?73289-Get-last-folder-name-in-a-path
Function GetLastDirName(strpath As String) As String
    Dim i, j
    strpath = IIf(Right(strpath, 1) = "\", Left(strpath, Len(strpath) - 1), strpath)
    i = InStr(1, strpath, "\")
    j = InStr(i + 1, strpath, "\")
    While (j <> 0)
        i = InStr(i + 1, strpath, "\")
        j = InStr(i + 1, strpath, "\")
    Wend
    GetLastDirName = Mid(strpath, i, Len(strpath) - i + 1)
    GetLastDirName = Right(GetLastDirName, Len(GetLastDirName) - 1)
End Function

Private Sub cmdInstall_Click()
    If txtHost.Text = "" Or txtPort.Text = "" Or txtSecret.Text = "" Or txtSkin.Text = "" Then
        Alert "모든 칸들을 채워주세요~", "오류", Me, 16
        Exit Sub
    End If

    iscomplete = True
    
    'https://stackoverflow.com/questions/21108664/how-to-create-txt-file
    Dim iFileNo As Integer
    iFileNo = FreeFile
    Open "config.json" For Output As #iFileNo
    Print #iFileNo, "{"
    Print #iFileNo, "    " & ChrW$(34) & "host" & ChrW$(34) & ": " & ChrW$(34) & txtHost.Text & ChrW$(34) & ", "
    Print #iFileNo, "    " & ChrW$(34) & "port" & ChrW$(34) & ": " & ChrW$(34) & txtPort.Text & ChrW$(34) & ", "
    Print #iFileNo, "    " & ChrW$(34) & "initialized" & ChrW$(34) & ": false, "
    Print #iFileNo, "    " & ChrW$(34) & "skin" & ChrW$(34) & ": " & ChrW$(34) & txtSkin.Text & ChrW$(34) & ", "
    Print #iFileNo, "    " & ChrW$(34) & "secret" & ChrW$(34) & ": " & ChrW$(34) & txtSecret.Text & ChrW$(34)
    Print #iFileNo, "}"
    Close #iFileNo
    
    Shell "cmd /c start node index.js"
    
    End
End Sub

Private Sub Form_Load()
    If CInt(Format(Now, "H")) >= 7 And CInt(Format(Now, "H")) < 16 Then
        imgDay.Visible = True
        Shape1.Visible = False
        Shape2.Visible = False
        Shape3.Visible = False
    ElseIf CInt(Format(Now, "H")) = 6 Or CInt(Format(Now, "H")) = 17 Then
        imgSunset.Visible = True
    Else
        imgNight.Visible = True
    End If

    If UCase(Command) <> "/I" Then
        iscomplete = True
        Alert "직접 실행할 수 없습니다;; RUN.BAT 혹은 SERVER.JS를 실행하세요^^", "안내", Me, 48
        End
    End If

    iscomplete = False
    
    Dim i As Integer
    dir.Path = dir.Path & "\skins"
    
    For i = 0 To dir.ListCount - 1
        txtSkin.AddItem GetLastDirName(dir.List(i))
    Next i
    
    txtSkin.ListIndex = 0
End Sub

Private Sub Form_Unload(Cancel As Integer)
    If Confirm("취소하시겠습니까? --; 항목을 채우고 설치를 누른 후 기다리시면 입력학 주소에 당신의 위키가 만들어집니다 ^^", "확인", Me, 48) Then
        End
    Else
        Cancel = 1
    End If
End Sub
